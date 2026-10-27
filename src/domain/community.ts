export type CommunityPost={id:string;author:string;initials:string;colour:string;age:string;text:string;likes:number;comments:number;following:boolean;featured:boolean};
// Entirely fictional profiles and illustrative engagement, independent of NBA providers.
export const communityPosts:CommunityPost[]=[
 {id:'demo-orbit',author:'OrbitClub',initials:'OC',colour:'purple',age:'2m',text:'That driving layup changed the momentum.',likes:1400,comments:128,following:true,featured:true},
 {id:'demo-current',author:'CurrentCourtside',initials:'CC',colour:'green',age:'3m',text:'We need a stop here. Come on!',likes:392,comments:64,following:true,featured:false},
 {id:'demo-hoops',author:'HoopsNotebook',initials:'HN',colour:'orange',age:'4m',text:'Great ball movement this quarter.',likes:641,comments:92,following:true,featured:true},
 {id:'demo-court',author:'CourtSideNotes',initials:'CN',colour:'blue',age:'5m',text:'This is shaping up to be a great finish.',likes:298,comments:41,following:true,featured:false},
 {id:'demo-river',author:'RiverWatch',initials:'RW',colour:'slate',age:'6m',text:'One possession at a time. Let’s go.',likes:186,comments:23,following:true,featured:false},
 {id:'demo-pines',author:'PinesPerspective',initials:'PP',colour:'green',age:'8m',text:'A little more patience on the next possession.',likes:84,comments:12,following:false,featured:true},
];
export function selectCommunityPosts(posts:CommunityPost[],tab:string,query:string){const term=query.trim().toLocaleLowerCase('en');return posts.filter(p=>(tab!=='Following'||p.following)&&(tab!=='Featured'||p.featured)&&(!term||`${p.author} ${p.text}`.toLocaleLowerCase('en').includes(term)));}
