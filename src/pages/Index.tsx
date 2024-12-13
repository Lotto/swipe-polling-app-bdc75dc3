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
          </div>
          <CreateSurveyForm />
        </div>
      </div>
    </div>
  );
};

export default Index;