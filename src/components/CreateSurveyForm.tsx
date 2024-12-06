import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { supabase } from '@/lib/supabase';
import { useToast } from './ui/use-toast';

export const CreateSurveyForm = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const questionsArray = questions.split('\n').filter(q => q.trim() !== '');
      
      const { data, error } = await supabase
        .from('surveys')
        .insert([
          { title, questions: questionsArray }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sondage créé !",
        description: "Votre sondage a été créé avec succès.",
      });

      setTitle('');
      setQuestions('');
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du sondage.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Titre du sondage
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Entrez le titre du sondage"
          required
        />
      </div>
      
      <div>
        <label htmlFor="questions" className="block text-sm font-medium mb-2">
          Questions (une par ligne)
        </label>
        <Textarea
          id="questions"
          value={questions}
          onChange={(e) => setQuestions(e.target.value)}
          placeholder="Entrez vos questions (une par ligne)"
          required
          className="min-h-[200px]"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Création...' : 'Créer le sondage'}
      </Button>
    </form>
  );
};