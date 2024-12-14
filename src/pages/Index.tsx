import { CreateSurveyForm } from "@/components/CreateSurveyForm";
import { FileText } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-purple-600 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
          <div className="flex flex-col items-center gap-4 mb-8">
            <FileText className="w-16 h-16 text-pink-500" />
            <h1 className="text-3xl font-bold text-center">
              Créer un sondage
            </h1>
            <div className="max-w-2xl text-center text-gray-600 space-y-2">
              <p>
                Le principe de cette application est de faire un sondage où les utilisateurs peuvent répondre par OUI ou NON en swipant à droite ou à gauche.
              </p>
              <p>
                Vous aurez accès au lien de partage du sondage et à la page des résultats.
              </p>
            </div>
          </div>
          <CreateSurveyForm />
        </div>
      </div>
    </div>
  );
};

export default Index;