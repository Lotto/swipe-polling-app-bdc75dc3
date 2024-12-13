import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Survey } from "@/types/survey";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ExternalLink, Trash2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ADMIN_PASSWORD = "normandieai"; // Changed password as requested

const Admin = () => {
  const { toast } = useToast();
  const [password, setPassword] = useState(ADMIN_PASSWORD);

  const { data: surveys } = useQuery(["surveys"], async () => {
    const { data, error } = await supabase.from("surveys").select("*");
    if (error) throw error;
    return data;
  });

  const handleDeleteSurvey = async (id: string) => {
    const { error } = await supabase.from("surveys").delete().eq("id", id);
    if (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du sondage.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succès",
        description: "Sondage supprimé avec succès.",
      });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter admin password"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {surveys?.map((survey) => (
            <TableRow key={survey.id}>
              <TableCell>{survey.title}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteSurvey(survey.id)}
                >
                  <Trash2 className="mr-2" />
                  Supprimer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Admin;
