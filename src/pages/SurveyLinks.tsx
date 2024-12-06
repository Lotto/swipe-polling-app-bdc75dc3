import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const SurveyLinks = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const surveyUrl = `${window.location.origin}/survey/${id}`;
  const resultsUrl = `${window.location.origin}/results/${id}`;

  const handleCopyLink = async (url: string, type: "sondage" | "résultats") => {
    await navigator.clipboard.writeText(url);
    toast({
      title: "Lien copié !",
      description: `Le lien pour ${type === "sondage" ? "répondre au" : "voir les résultats du"} sondage a été copié.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-purple-600 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            Votre sondage est prêt !
          </h1>
          
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Lien pour répondre au sondage</h2>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-gray-50 p-4 rounded-lg break-all">
                  {surveyUrl}
                </div>
                <Button onClick={() => handleCopyLink(surveyUrl, "sondage")}>
                  Copier
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Lien pour voir les résultats</h2>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-gray-50 p-4 rounded-lg break-all">
                  {resultsUrl}
                </div>
                <Button onClick={() => handleCopyLink(resultsUrl, "résultats")}>
                  Copier
                </Button>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full mt-8"
              onClick={() => navigate("/")}
            >
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyLinks;