import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Survey } from "@/types/survey";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useSwipeable } from "react-swipeable";

const SurveyPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);

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
        setSwipeDirection(null);
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
    onSwipedLeft: () => {
      setSwipeDirection("left");
      submitResponse.mutate({ isLiked: false });
    },
    onSwipedRight: () => {
      setSwipeDirection("right");
      submitResponse.mutate({ isLiked: true });
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

  const currentQuestion = survey.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / survey.questions.length) * 100;

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
            className={`text-center mb-8 cursor-grab active:cursor-grabbing transition-transform duration-300 ${
              swipeDirection === "left" 
                ? "-translate-x-full opacity-0" 
                : swipeDirection === "right" 
                ? "translate-x-full opacity-0" 
                : ""
            }`}
          >
            <h1 className="text-2xl font-bold mb-8">{survey.title}</h1>
            <p className="text-xl mb-8">{currentQuestion}</p>
          </div>
          <div className="flex gap-4">
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
            Question {currentQuestionIndex + 1} sur {survey.questions.length}
          </div>
          <div className="mt-8 text-sm text-gray-500">
            Glissez vers la droite pour répondre "Oui" ou vers la gauche pour répondre "Non"
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