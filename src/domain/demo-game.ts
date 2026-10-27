export const demoEvents = [
 {quarter:4,clock:'2:14',team:'home',player:'E. Carter',text:'makes driving layup (2 PTS)',score:'103 - 101'},
 {quarter:4,clock:'2:37',team:'away',player:'M. Reed',text:'defensive rebound'},
 {quarter:4,clock:'2:38',team:'home',player:'J. Brooks',text:'misses 25-foot jumper'},
 {quarter:4,clock:'3:01',team:'away',player:'A. Hayes',text:'makes 3-point jumper (3 PTS)',score:'101 - 101'},
 {quarter:4,clock:'3:12',team:'home',player:'T. Ellis',text:'turnover (lost ball)'},
 {quarter:4,clock:'3:28',team:'away',player:'S. Morgan',text:'steals turnover'},
 {quarter:3,clock:'0:00',team:'home',player:'End of third quarter',text:'Uptown 77 · Riverside 77',score:'77 - 77'},
] as const;
export type DemoPlayer={name:string;bench:boolean;minutes:number;points:number;rebounds:number;assists:number;fg:string};
// Partial illustrative rosters, deliberately separate from provider data and game totals.
export const demoPlayers:DemoPlayer[]=[
 {name:'E. Carter',bench:false,minutes:34,points:28,rebounds:7,assists:8,fg:'10/18'},
 {name:'J. Brooks',bench:false,minutes:32,points:24,rebounds:12,assists:2,fg:'9/15'},
 {name:'T. Ellis',bench:false,minutes:28,points:16,rebounds:4,assists:6,fg:'6/12'},
 {name:'N. Parker',bench:false,minutes:26,points:11,rebounds:6,assists:2,fg:'4/9'},
 {name:'D. Cole',bench:false,minutes:30,points:14,rebounds:3,assists:5,fg:'5/11'},
 {name:'R. Lane',bench:true,minutes:18,points:6,rebounds:2,assists:3,fg:'2/6'},
 {name:'K. Wood',bench:true,minutes:14,points:4,rebounds:5,assists:1,fg:'2/5'},
 {name:'P. Bell',bench:true,minutes:12,points:0,rebounds:6,assists:0,fg:'0/2'},
 {name:'L. Stone',bench:true,minutes:10,points:0,rebounds:1,assists:1,fg:'0/1'},
];
export const awayDemoPlayers:DemoPlayer[]=demoPlayers.map((p,i)=>({...p,name:['M. Reed','A. Hayes','S. Morgan','C. Quinn','B. Wells','J. Ford','F. Grant','O. Ross','H. Gray'][i]}));
