
'use client';

import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { contentData } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { logout } from './login/actions';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Trash2 } from 'lucide-react';

const episodeSchema = z.object({
  id: z.string().min(1, 'Episode ID is required'),
  title: z.string().min(1, 'Episode title is required'),
  description: z.string().min(1, 'Episode description is required'),
  thumbnailUrl: z.string().url('Must be a valid URL'),
  videoUrl: z.string().url('Must be a valid URL'),
});

const seasonSchema = z.object({
  season: z.number().min(1),
  episodes: z.array(episodeSchema).min(1, 'Each season must have at least one episode.'),
});

const contentSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  thumbnailUrl: z.string().url('Must be a valid URL'),
  type: z.enum(['movie', 'tv']),
  videoUrl: z.string().optional(),
  seasons: z.array(seasonSchema).optional(),
}).refine(data => {
    if (data.type === 'movie') return !!data.videoUrl && data.videoUrl.length > 0;
    return true;
}, { message: "Video URL is required for movies.", path: ["videoUrl"] })
.refine(data => {
    if (data.type === 'tv') return !!data.seasons && data.seasons.length > 0;
    return true;
}, { message: "At least one season is required for TV shows.", path: ["seasons"] });


type ContentFormValues = z.infer<typeof contentSchema>;


export default function AdminPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      type: 'movie',
      seasons: [],
    },
  });

  const { fields: seasonFields, append: appendSeason, remove: removeSeason } = useFieldArray({
    control: form.control,
    name: "seasons",
  });

  const contentType = form.watch('type');

  const onSubmit = (data: ContentFormValues) => {
    // In a real application, this would be a server action to save the data.
    // For this prototype, we'll just show a notification and log the data.
    console.log('Submitting new content:', JSON.stringify(data, null, 2));
    toast({
      title: 'Content Submitted (Simulated)',
      description: 'Check the browser console to see the submitted data.',
    });
    // form.reset(); // Optionally reset form
  };
  
  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const filteredContent = contentData.filter(content =>
    content.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Admin Panel</h1>
            <Button variant="outline" onClick={handleLogout}>Log Out</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Existing Content</CardTitle>
                <CardDescription>A list of all content currently in the library.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {filteredContent.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div>
                                <p className="font-bold">{item.title}</p>
                                <p className="text-sm text-muted-foreground">{item.category} &middot; {item.type.toUpperCase()}</p>
                            </div>
                            <Button variant="outline" size="sm">Manage</Button>
                        </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Add New Content</CardTitle>
                <CardDescription>Fill out the form to add a new movie or TV show.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="id" render={({ field }) => (
                            <FormItem><FormLabel>ID</FormLabel><FormControl><Input placeholder="e.g., 'new-movie'" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="Content Title" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>

                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Content Description" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="category" render={({ field }) => (
                            <FormItem><FormLabel>Category</FormLabel><FormControl><Input placeholder="e.g., 'Action'" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="thumbnailUrl" render={({ field }) => (
                            <FormItem><FormLabel>Thumbnail URL</FormLabel><FormControl><Input placeholder="https://picsum.photos/seed/..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                    
                    <FormField control={form.control} name="type" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Content Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select content type" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="movie">Movie</SelectItem>
                                    <SelectItem value="tv">TV Show</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />

                    {contentType === 'movie' && (
                        <FormField control={form.control} name="videoUrl" render={({ field }) => (
                            <FormItem><FormLabel>Video URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    )}

                    {contentType === 'tv' && (
                      <div className="space-y-4 rounded-lg border p-4">
                        <FormLabel>Seasons & Episodes</FormLabel>
                        {seasonFields.map((season, seasonIndex) => (
                          <div key={season.id} className="space-y-4 rounded-md border bg-muted/50 p-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold">Season {seasonIndex + 1}</h4>
                              <Button type="button" variant="ghost" size="icon" onClick={() => removeSeason(seasonIndex)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                            </div>
                             <EpisodeArray control={form.control} seasonIndex={seasonIndex} />
                          </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={() => appendSeason({ season: seasonFields.length + 1, episodes: [] })}><PlusCircle className="mr-2 h-4 w-4" /> Add Season</Button>
                        <FormMessage>{form.formState.errors.seasons?.message}</FormMessage>
                      </div>
                    )}
                    
                    <Separator />
                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'Submitting...' : 'Add Content'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}


function EpisodeArray({ control, seasonIndex }: { control: any, seasonIndex: number }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `seasons.${seasonIndex}.episodes`,
  });

  return (
    <div className="space-y-4">
      {fields.map((episode, episodeIndex) => (
        <div key={episode.id} className="space-y-3 rounded-md border bg-background p-4">
           <div className="flex items-center justify-between">
              <h5 className="font-semibold">Episode {episodeIndex + 1}</h5>
              <Button type="button" variant="ghost" size="icon" onClick={() => remove(episodeIndex)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
            <Controller
                control={control}
                name={`seasons.${seasonIndex}.episodes.${episodeIndex}.id`}
                render={({ field, fieldState }) => (
                   <FormItem>
                    <FormLabel>Episode ID</FormLabel>
                    <FormControl><Input placeholder="e.g., ep101" {...field} /></FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                   </FormItem>
                )}
            />
            <Controller
                control={control}
                name={`seasons.${seasonIndex}.episodes.${episodeIndex}.title`}
                render={({ field, fieldState }) => (
                   <FormItem>
                    <FormLabel>Episode Title</FormLabel>
                    <FormControl><Input placeholder="Episode Title" {...field} /></FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                   </FormItem>
                )}
            />
            <Controller
                control={control}
                name={`seasons.${seasonIndex}.episodes.${episodeIndex}.description`}
                render={({ field, fieldState }) => (
                   <FormItem>
                    <FormLabel>Episode Description</FormLabel>
                    <FormControl><Textarea placeholder="Episode Description" {...field} /></FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                   </FormItem>
                )}
            />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                    control={control}
                    name={`seasons.${seasonIndex}.episodes.${episodeIndex}.thumbnailUrl`}
                    render={({ field, fieldState }) => (
                    <FormItem>
                        <FormLabel>Episode Thumbnail URL</FormLabel>
                        <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                    )}
                />
                <Controller
                    control={control}
                    name={`seasons.${seasonIndex}.episodes.${episodeIndex}.videoUrl`}
                    render={({ field, fieldState }) => (
                    <FormItem>
                        <FormLabel>Episode Video URL</FormLabel>
                        <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                    )}
                />
            </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => append({ id: '', title: '', description: '', thumbnailUrl: '', videoUrl: '' })}>
        <PlusCircle className="mr-2 h-4 w-4" /> Add Episode
      </Button>
       <FormMessage>{(control._formState.errors as any)?.seasons?.[seasonIndex]?.episodes?.message}</FormMessage>
    </div>
  );
}
