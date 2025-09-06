
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
    id: 'the-mandalorian',
    title: 'The Mandalorian',
    description: 'The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.',
    category: 'Sci-Fi',
    thumbnailUrl: 'https://picsum.photos/seed/mandalorian/600/400',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    type: 'tv',
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
    id: 'blade-runner-2049',
    title: 'Blade Runner 2049',
    description: 'Young Blade Runner K\'s discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who\'s been missing for 30 years.',
    category: 'Sci-Fi',
    thumbnailUrl: 'https://picsum.photos/seed/bladerunner/600/400',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    type: 'movie',
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
    id: 'friends',
    title: 'Friends',
    description: 'Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan.',
    category: 'Comedy',
    thumbnailUrl: 'https://picsum.photos/seed/friends/600/400',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    type: 'tv',
  },
  {
    id: 'parks-and-rec',
    title: 'Parks and Recreation',
    description: 'The absurd antics of an Indiana town\'s public officials as they pursue sundry projects to make their city a better place.',
    category: 'Comedy',
    thumbnailUrl: 'https://picsum.photos/seed/parks/600/400',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    type: 'tv',
  },
  {
    id: 'superbad',
    title: 'Superbad',
    description: 'Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a booze-soaked party goes awry.',
    category: 'Comedy',
    thumbnailUrl: 'https://picsum.photos/seed/superbad/600/400',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    type: 'movie',
  },
  {
    id: 'booksmart',
    title: 'Booksmart',
    description: 'On the eve of their high school graduation, two academic superstars and best friends realize they should have worked less and played more. Determined not to fall short of their peers, the girls try to cram four years of fun into one night.',
    category: 'Comedy',
    thumbnailUrl: 'https://picsum.photos/seed/booksmart/600/400',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    type: 'movie',
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
    id: 'dark-knight',
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    category: 'Action',
    thumbnailUrl: 'https://picsum.photos/seed/darkknight/600/400',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    type: 'movie',
  },
  {
    id: 'john-wick',
    title: 'John Wick',
    description: 'An ex-hit-man comes out of retirement to track down the gangsters that took everything from him.',
    category: 'Action',
    thumbnailUrl: 'https://picsum.photos/seed/wick/600/400',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    type: 'movie',
  },
  {
    id: 'mad-max-fury-road',
    title: 'Mad Max: Fury Road',
    description: 'In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the help of a group of female prisoners, a psychotic worshiper, and a drifter named Max.',
    category: 'Action',
    thumbnailUrl: 'https://picsum.photos/seed/madmax/600/400',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    type: 'movie',
  },
  {
    id: 'gladiator',
    title: 'Gladiator',
    description: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.',
    category: 'Action',
    thumbnailUrl: 'https://picsum.photos/seed/gladiator/600/400',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
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
    id: 'pulp-fiction',
    title: 'Pulp Fiction',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    category: 'Drama',
    thumbnailUrl: 'https://picsum.photos/seed/pulp/600/400',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    type: 'movie',
  },
  {
    id: 'forrest-gump',
    title: 'Forrest Gump',
    description: 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.',
    category: 'Drama',
    thumbnailUrl: 'https://picsum.photos/seed/forrest/600/400',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    type: 'movie',
  },
  {
    id: 'the-godfather',
    title: 'The Godfather',
    description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    category: 'Drama',
    thumbnailUrl: 'https://picsum.photos/seed/godfather/600/400',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    type: 'movie',
  },
  {
    id: 'shawshank-redemption',
    title: 'The Shawshank Redemption',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    category: 'Drama',
    thumbnailUrl: 'https://picsum.photos/seed/shawshank/600/400',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    type: 'movie',
  },
  {
    id: 'silence-of-the-lambs',
    title: 'The Silence of the Lambs',
    description: 'A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer, a madman who skins his victims.',
    category: 'Thriller',
    thumbnailUrl: 'https://picsum.photos/seed/lambs/600/400',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    type: 'movie',
  },
  {
    id: 'the-shining',
    title: 'The Shining',
    description: 'A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence, while his psychic son sees horrific forebodings from both past and future.',
    category: 'Thriller',
    thumbnailUrl: 'https://picsum.photos/seed/shining/600/400',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    type: 'movie',
  },
    {
    id: 'parasite',
    title: 'Parasite',
    description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    category: 'Thriller',
    thumbnailUrl: 'https://picsum.photos/seed/parasite/600/400',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    type: 'movie',
  },
  {
    id: 'get-out',
    title: 'Get Out',
    description: 'A young African-American visits his white girlfriend\'s parents for the weekend, where his simmering uneasiness about their reception of him eventually reaches a boiling point.',
    category: 'Thriller',
    thumbnailUrl: 'https://picsum.photos/seed/getout/600/400',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    type: 'movie',
  },
  {
    id: 'se7en',
    title: 'Se7en',
    description: 'Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motives.',
    category: 'Thriller',
    thumbnailUrl: 'https://picsum.photos/seed/seven/600/400',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    type: 'movie',
  }
];
