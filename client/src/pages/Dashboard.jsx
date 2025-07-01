import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, MessageSquare, History, Loader2 } from 'lucide-react';
import { feedbackAPI } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

const feedbackSchema = z.object({
  user_input: z.string().min(1, 'Please enter some text').max(2000, 'Text is too long'),
});

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(feedbackSchema),
  });

  // Load feedback history on component mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await feedbackAPI.getHistory();
      setHistory(response.data.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load feedback history",
        variant: "destructive",
      });
    } finally {
      setLoadingHistory(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setFeedback('');

    try {
      const response = await feedbackAPI.create(data.user_input);
      const newFeedback = response.data.data;
      
      setFeedback(newFeedback.feedback);
      
      // Update history with new feedback (add to beginning and keep only 5)
      setHistory(prev => [newFeedback, ...prev].slice(0, 5));
      
      toast({
        title: "Success!",
        description: "Feedback generated successfully.",
      });
      
      reset(); // Clear the form
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || 'Failed to generate feedback',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">AI Feedback</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarFallback>
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700">
                  {user?.username}
                </span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle>Submit Your Response</CardTitle>
                <CardDescription>
                  Enter your text below to receive AI-powered feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="user_input">Your Response</Label>
                    <Textarea
                      id="user_input"
                      placeholder="Enter your text here..."
                      className={`min-h-[120px] ${errors.user_input ? 'border-red-500' : ''}`}
                      {...register('user_input')}
                    />
                    {errors.user_input && (
                      <p className="text-sm text-red-500">{errors.user_input.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Feedback...
                      </>
                    ) : (
                      'Get Feedback'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Feedback Display */}
            {feedback && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>AI Feedback</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {feedback}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* History Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <History className="h-5 w-5" />
                  <span>Recent History</span>
                </CardTitle>
                <CardDescription>
                  Your last 5 submissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingHistory ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : history.length > 0 ? (
                  <div className="space-y-4">
                    {history.map((item, index) => (
                      <div key={item.id || index} className="space-y-2">
                        <div className="text-xs text-gray-500">
                          {formatDate(item.createdAt)}
                        </div>
                        <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                          <div className="font-medium mb-1">Input:</div>
                          <div className="text-xs line-clamp-2 mb-2">
                            {item.user_input}
                          </div>
                          <div className="font-medium mb-1">Feedback:</div>
                          <div className="text-xs line-clamp-3" title={item.feedback}>
                            {item.feedback}
                          </div>
                        </div>
                        {index < history.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <History className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No submissions yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}