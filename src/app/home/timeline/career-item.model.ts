/* eslint-disable max-len */
export class CareerItemModel {
    id: number;
    name: string;
    icon: string;
    description: string;
    expanded: boolean;
    children: Array<CareerItemModel> = [];

    constructor(options?: Partial<CareerItemModel>) {
        if (options) {
            Object.assign(this, options);
        }
    }
}

export const careerItems: Array<CareerItemModel> = [
    new CareerItemModel({
        name: 'jobs',
        expanded: true,
        children: [
            new CareerItemModel({
                id: 1,
                name: 'staff-software-engineer.job',
                icon: 'fa-wrench',
                description: 'My current role at NAVEX. I help lead the front-end architecture of NAVEX\'s IRM web application.'
            })
        ]
    }),
    new CareerItemModel({
        name: 'companies',
        expanded: true,
        children: [
            new CareerItemModel({
                id: 2,
                name: 'navex',
                icon: 'fa-building',
                description: 'navex description'
            })
        ]
    }),
    new CareerItemModel({
        name: 'locations',
        expanded: true,
        children: [
            new CareerItemModel({
                id: 3,
                name: 'minneapolis.mn',
                icon: 'fa-map-marker-alt',
                description: 'minneapolis minnesota description'
            })
        ]
    })
];
