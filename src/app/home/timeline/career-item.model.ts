/* eslint-disable max-len */
export class CareerItemModel {
    public name: string;
    public company: string;
    public timeframe: string;
    public content: string;
    public expanded: boolean;

    private _id: string;

    constructor(options?: Partial<CareerItemModel>) {
        this._id = crypto.randomUUID().toString();

        if (options) {
            Object.assign(this, options);
        }
    }

    public get id(): string {
        return this._id;
    }
}

export const careerItems: Array<CareerItemModel> = [
    new CareerItemModel({
        name: 'Staff Software Engineer',
        company: 'NAVEX',
        timeframe: '2023 - present',
        content: 'My current role. I help lead the front-end architecture of NAVEX\'s IRM web application.'
    }),
    new CareerItemModel({
        name: 'Senior Software Engineer',
        company: 'NAVEX',
        timeframe: '2022 - 2023',
        content: 'content goes here'
    }),
    new CareerItemModel({
        name: 'Software Engineer',
        company: 'Lockpath / NAVEX',
        timeframe: '2017 - 2022',
        content: 'content goes here'
    }),
    new CareerItemModel({
        name: 'Web Developer',
        company: 'AllofE Solutions',
        timeframe: '2014 - 2017',
        content: 'content goes here'
    })
];
