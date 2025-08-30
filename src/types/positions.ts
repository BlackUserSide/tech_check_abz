export interface Position {
    id: number;
    name: string;
}
export interface PositionsReq  {
    success: boolean;
    positions: Position[];
}