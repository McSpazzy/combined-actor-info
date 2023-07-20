export interface BondTarget { Index: number; Matrix: number; };
export class Bond {
    Source: BondTarget = {} as BondTarget;
    Target: BondTarget = {} as BondTarget;
}
