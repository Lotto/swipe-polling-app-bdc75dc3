import { CreateSurveyForm } from "@/components/CreateSurveyForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-purple-600 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-6">
        <h1 className="text-3xl font-bold text-center mb-8">
          Créez votre sondage style Tinder
        </h1>
        <CreateSurveyForm />
      </div>
    </div>
  );
};

export default Index;