import { fixtures, selectGames, type Game, type Query } from '@/domain/nba';
export interface NbaReadRepository { listGames(query:Query):Promise<Game[]>; getGame(id:string):Promise<Game|undefined> }
export const mockRepository:NbaReadRepository={async listGames(query){return selectGames(fixtures,query)},async getGame(id){return fixtures.find(g=>g.id===id)}};
