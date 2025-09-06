
export type Content = {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  videoUrl: string;
  type: 'movie' | 'tv';
};

export type UserProfile = {
  id: string;
  name: string;
  avatarUrl: string;
};

export const userProfiles: UserProfile[] = [
  {
    id: '1',
    name: 'Alex',
    avatarUrl: 'https://picsum.photos/seed/alex/200',
  },
  {
    id: '2',
    name: 'Casey',
    avatarUrl: 'https://picsum.photos/seed/casey/200',
  },
  {
    id: '3',
    name: 'Jordan',
    avatarUrl: 'https://picsum.photos/seed/jordan/200',
  },
  {
    id: '4',
    name: 'Taylor',
    avatarUrl: 'https://picsum.photos/seed/taylor/200',
  },
    {
    id: '5',
    name: 'Kids',
    avatarUrl: 'https://picsum.photos/seed/kids/200',
  },
];


export const contentData: Content[] = [
  {
    id: 'the-avengers',
    title: 'The Avengers',
    description: 'Earth\'s mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.',
    category: 'Sci-Fi',
    thumbnailUrl: 'https://picsum.photos/seed/avengers/600/400',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    type: 'movie',
  },
  {
    id: 'stranger-things',
    title: 'Stranger Things',
    description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.',
    category: 'Sci-Fi',
    thumbnailUrl: 'https://picsum.photos/seed/stranger/600/400',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    type: 'tv',
  },
  {
    id: 'stranger',
    title: 'Stranger',
    description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.',
    category: 'Sci-Fi',
    thumbnailUrl: 'https://picsum.photos/seed/stranger/600/400',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    type: 'tv',
  },
  {
    id: 'the-office',
    title: 'The Office',
    description: 'A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.',
    category: 'Comedy',
    thumbnailUrl: 'https://picsum.photos/seed/office/600/400',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    type: 'tv',
  },
  {
    id: 'inception',
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    category: 'Action',
    thumbnailUrl: 'https://picsum.photos/seed/inception/600/400',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    type: 'movie',
  },
  {
    id: 'breaking-bad',
    title: 'Breaking Bad',
    description: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family\'s future.',
    category: 'Drama',
    thumbnailUrl: 'https://picsum.photos/seed/breaking/600/400',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    type: 'tv',
  },
    {
    id: 'the-mandalorian',
    title: 'The Mandalorian',
    description: 'The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.',
    category: 'Sci-Fi',
    thumbnailUrl: 'https://picsum.photos/seed/mandalorian/600/400',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    type: 'tv',
  },
  {
    id: 'pulp-fiction',
    title: 'Pulp Fiction',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    category: 'Drama',
    thumbnailUrl: 'https://picsum.photos/seed/pulp/600/400',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    type: 'movie',
  },
  {
    id: 'friends',
    title: 'Friends',
    description: 'Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan.',
    category: 'Comedy',
    thumbnailUrl: 'https://picsum.photos/seed/friends/600/400',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    type: 'tv',
  },
  {
    id: 'dark-knight',
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    category: 'Action',
    thumbnailUrl: 'https://picsum.photos/seed/darkknight/600/400',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    type: 'movie',
  },
   {
    id: 'black-mirror',
    title: 'Black Mirror',
    description: 'An anthology series exploring a twisted, high-tech multiverse where humanity\'s greatest innovations and darkest instincts collide.',
    category: 'Sci-Fi',
    thumbnailUrl: 'https://picsum.photos/seed/blackmirror/600/400',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    type: 'tv',
  },
  {
    id: 'mirror',
    title: 'Mirror',
    description: 'An anthology series exploring a twisted, high-tech multiverse where humanity\'s greatest innovations and darkest instincts collide.',
    category: 'Sci-Fi',
    thumbnailUrl: 'https://picsum.photos/seed/blackmirror/600/400',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    type: 'tv',
  },
];
