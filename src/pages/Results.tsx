import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Survey, SurveyResponse } from "@/types/survey";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface QuestionResult {
  question: string;
  totalResponses: number;
  yesResponses: number;
  yesPercentage: number;
}

const Results = () => {
  const { id } = useParams();

  const { data: survey } = useQuery({
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

  const { data: responses } = useQuery({
    queryKey: ["survey-responses", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("survey_responses")
        .select("*")
        .eq("survey_id", id);

      if (error) throw error;
      return data as SurveyResponse[];
    },
  });

  const results: QuestionResult[] = survey?.questions.map((question, index) => {
    const questionResponses = responses?.filter(
      (r) => r.question_index === index
    ) || [];
    const totalResponses = questionResponses.length;
    const yesResponses = questionResponses.filter((r) => r.is_liked).length;
    const yesPercentage = totalResponses > 0 
      ? (yesResponses / totalResponses) * 100 
      : 0;

    return {
      question,
      totalResponses,
      yesResponses,
      yesPercentage,
    };
  }) || [];

  // Trier les résultats par nombre de "oui" décroissant
  const sortedResults = [...results].sort((a, b) => b.yesResponses - a.yesResponses);

  if (!survey || !responses) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Chargement des résultats...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-purple-600 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-6">
        <h1 className="text-3xl font-bold mb-8 text-center">{survey.title}</h1>
        <div className="space-y-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead className="w-[200px]">Réponses positives</TableHead>
                <TableHead className="text-right">Total réponses</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedResults.map((result) => (
                <TableRow key={result.question}>
                  <TableCell className="font-medium">{result.question}</TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <Progress value={result.yesPercentage} />
                      <div className="text-sm text-gray-500">
                        {result.yesPercentage.toFixed(1)}% ({result.yesResponses})
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {result.totalResponses}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Results;