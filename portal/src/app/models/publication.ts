export class Publication{ 
    constructor(
        public _id: string,
        public text: string,
        public file: string,
        public createAt: string,
        public user: string
    ){}
}