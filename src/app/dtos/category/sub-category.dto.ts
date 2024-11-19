
export class SubCategoryDTO {
    name: string;
    category_id: number;


    constructor(data: any) {
        this.name = data.name;
        this.category_id = data.category_id;

    }

}