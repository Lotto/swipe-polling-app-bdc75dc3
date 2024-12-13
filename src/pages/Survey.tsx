import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Survey } from "@/types/survey";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useSwipeable } from "react-swipeable";
import { Card, CardContent } from "@/components/ui/card";

const SurveyPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [swipePosition, setSwipePosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const { data: survey, isLoading } = useQuery({
    queryKey: ["survey", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("surveys")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Survey;
    },
  });

  const submitResponse = useMutation({
    mutationFn: async ({ isLiked }: { isLiked: boolean }) => {
      const { error } = await supabase.from("survey_responses").insert({
        survey_id: id,
        question_index: currentQuestionIndex,
        is_liked: isLiked,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      if (survey && currentQuestionIndex < survey.questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSwipePosition(0);
      } else {
        setIsSubmitting(true);
        toast({
          title: "Merci !",
          description: "Vos réponses ont été enregistrées.",
        });
        setTimeout(() => {
          window.close();
        }, 2000);
      }
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de votre réponse.",
        variant: "destructive",
      });
    },
  });

  const handlers = useSwipeable({
    onSwiping: (e) => {
      setIsDragging(true);
      const newPosition = e.deltaX;
      setSwipePosition(newPosition);
    },
    onSwipedLeft: () => {
      if (Math.abs(swipePosition) > 100) {
        submitResponse.mutate({ isLiked: false });
      }
      setIsDragging(false);
      setSwipePosition(0);
    },
    onSwipedRight: () => {
      if (Math.abs(swipePosition) > 100) {
        submitResponse.mutate({ isLiked: true });
      }
      setIsDragging(false);
      setSwipePosition(0);
    },
    onTouchEndOrOnMouseUp: () => {
      setIsDragging(false);
      setSwipePosition(0);
    },
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Sondage introuvable</h1>
          <p className="text-gray-600">Ce sondage n'existe pas ou a été supprimé.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = survey?.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / (survey?.questions.length || 1)) * 100;

  const getSwipeStyles = () => {
    const rotate = swipePosition / 10;
    const opacity = Math.max(1 - Math.abs(swipePosition) / 500, 0.5);
    return {
      transform: `translateX(${swipePosition}px) rotate(${rotate}deg)`,
      opacity,
      transition: isDragging ? 'none' : 'all 0.5s ease-out',
      cursor: isDragging ? 'grabbing' : 'grab',
    };
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {!isSubmitting ? (
        <>
          <div className="w-full max-w-lg">
            <div className="h-2 w-full bg-gray-200 rounded-full mb-6">
              <div
                className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          <div 
            {...handlers}
            className="w-full max-w-md perspective-1000"
          >
            <Card 
              className="transform-gpu hover:scale-[1.02] hover:-translate-y-1"
              style={getSwipeStyles()}
            >
              <CardContent className="p-8">
                <h1 className="text-2xl font-bold mb-8 text-center">{survey?.title}</h1>
                <p className="text-xl mb-8 text-center">{currentQuestion}</p>
                <div className="flex justify-between items-center mt-6 text-gray-400">
                  <div className="flex items-center gap-2">
                    <ThumbsDown className="w-5 h-5" />
                    <span>Glisser à gauche</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Glisser à droite</span>
                    <ThumbsUp className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="mt-8 flex gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => submitResponse.mutate({ isLiked: false })}
              className="flex items-center gap-2"
            >
              <ThumbsDown className="w-5 h-5" />
              Non
            </Button>
            <Button
              size="lg"
              onClick={() => submitResponse.mutate({ isLiked: true })}
              className="flex items-center gap-2"
            >
              <ThumbsUp className="w-5 h-5" />
              Oui
            </Button>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Question {currentQuestionIndex + 1} sur {survey?.questions.length}
          </div>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Merci pour vos réponses !</h2>
          <p className="text-gray-600">Cette fenêtre va se fermer automatiquement...</p>
        </div>
      )}
    </div>
  );
};

export default SurveyPage;
