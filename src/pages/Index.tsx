import { CreateSurveyForm } from "@/components/CreateSurveyForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Survey } from "@/types/survey";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();
  const { data: surveys } = useQuery({
    queryKey: ['surveys'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Survey[];
    }
  });

  const handleShare = async (surveyId: string) => {
    const shareUrl = `${window.location.origin}/survey/${surveyId}`;
    await navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Lien copié !",
      description: "Le lien du sondage a été copié dans votre presse-papiers.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-purple-600 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            Créez votre sondage style Tinder
          </h1>
          <CreateSurveyForm />
        </div>

        {surveys && surveys.length > 0 && (
          <div className="bg-white rounded-xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Vos sondages</h2>
            <div className="space-y-4">
              {surveys.map((survey) => (
                <div key={survey.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold">{survey.title}</h3>
                    <p className="text-sm text-gray-500">
                      {survey.questions.length} questions
                    </p>
                  </div>
                  <Button onClick={() => handleShare(survey.id)}>
                    Partager
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;