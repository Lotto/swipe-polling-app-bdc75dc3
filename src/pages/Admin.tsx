import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Survey } from "@/types/survey";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ExternalLink, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Admin = () => {
  const { toast } = useToast();
  const { data: surveys, refetch } = useQuery({
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

  const handleDelete = async (surveyId: string) => {
    const { error } = await supabase
      .from('surveys')
      .delete()
      .eq('id', surveyId);

    if (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du sondage.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Le sondage a été supprimé.",
    });
    refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-purple-600 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-6">
          <h1 className="text-3xl font-bold mb-8">Administration des sondages</h1>

          {surveys && surveys.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {surveys.map((survey) => (
                  <TableRow key={survey.id}>
                    <TableCell className="font-medium">
                      {survey.title}
                    </TableCell>
                    <TableCell>{survey.questions.length} questions</TableCell>
                    <TableCell>
                      {new Date(survey.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => window.open(`/survey/${survey.id}`, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(survey.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-gray-500">Aucun sondage trouvé</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;