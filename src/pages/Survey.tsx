import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useSwipeable } from "react-swipeable";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Survey } from "@/types/survey";

const Survey = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const { data, isLoading, error } = useQuery<Survey>(["survey", id], async () => {
    const { data, error } = await supabase
      .from("surveys")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  });

  const submitResponse = useMutation(async (response) => {
    const { error } = await supabase
      .from("responses")
      .insert([{ survey_id: id, isLiked: response.isLiked }]);
    if (error) throw new Error(error.message);
  });

  const handlers = useSwipeable({
    onSwipedLeft: () => submitResponse.mutate({ isLiked: false }),
    onSwipedRight: () => submitResponse.mutate({ isLiked: true }),
    onMouseDown: () => setIsDragging(true),
    onMouseUp: () => setIsDragging(false),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-purple-600 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {isLoading ? (
          <div className="text-center text-white">Chargement...</div>
        ) : error ? (
          <div className="text-center text-white">Une erreur est survenue</div>
        ) : (
          <div
            {...handlers}
            className="relative"
            style={{
              transform: `translateX(${offset}px) rotate(${rotation}deg)`,
              transition: isDragging ? "none" : "all 0.5s ease-out",
            }}
          >
            <div className="bg-white rounded-xl shadow-xl p-6">
              <h2 className="text-2xl font-bold mb-8">{data?.title}</h2>
              {currentQuestionIndex < data?.questions?.length ? (
                <>
                  <p className="text-lg mb-8">
                    {data?.questions[currentQuestionIndex]}
                  </p>
                  <div className="flex justify-between gap-4">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => submitResponse.mutate({ isLiked: false })}
                      className="flex items-center gap-2 bg-white text-gray-900"
                    >
                      <ThumbsDown className="w-5 h-5" />
                      Non
                    </Button>
                    <Button
                      size="lg"
                      onClick={() => submitResponse.mutate({ isLiked: true })}
                      className="flex items-center gap-2 bg-black text-white"
                    >
                      <ThumbsUp className="w-5 h-5" />
                      Oui
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">
                    Merci d'avoir participé au sondage !
                  </h3>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Survey;
