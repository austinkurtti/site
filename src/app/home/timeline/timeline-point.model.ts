/* eslint-disable max-len */
export class TimelineEventModel {
    expanded: boolean;
    startDate: Date;
    endDate: Date;
    name: string;
    description: string;

    constructor(options?: Partial<TimelineEventModel>) {
        if (options) {
            Object.assign(this, options);
        }
    }
}

export const timelineEvents: TimelineEventModel[] = [
    new TimelineEventModel({
        expanded: true,
        startDate: new Date(2012, 7),
        endDate: new Date(2017, 4),
        name: 'University of Kansas',
        description: 'Graduated from KU with a B.S. in Computer Science. Rock Chalk!'
    }),
    new TimelineEventModel({
        startDate: new Date(2014, 1),
        endDate: new Date(2017, 2),
        name: 'AllofE Solutions',
        description: 'The first job I had in the web development space. I was hired as a part time web developer with AllofE in Lawrence, Kansas. My most notable projects concerned the design and implementation of features for eMedley, a brand new product suite. I also helped maintain legacy websites and contributed to upgrades of company intranet tools.'
    }),
    new TimelineEventModel({
        startDate: new Date(2017, 5),
        endDate: new Date(2019, 7),
        name: 'Lockpath',
        description: 'After graduating from KU in the summer of 2017, I began my full-time professional career as a Software Engineer with Lockpath in Overland Park, Kansas. I initially worked on back-end projects, but after several months was recruited to the front-end team to help with a crucial UI overhaul. During the overhaul, I started developing a deep understanding of Angular and established that I most enjoy front-end work.'
    }),
    new TimelineEventModel({
        startDate: new Date(2019, 7),
        endDate: new Date(),
        name: 'Navex',
        description: 'Lockpath was acquired in August 2019 by Navex Global, which rebranded to Navex at the beginning of 2022. My current position is Staff Software Engineer on the Navex IRM team. I am responsible for the overall architecture of the IRM Angular application, review pull requests from other engineers as a repository codeowner, and work with the product team to define acceptance criteria for upcoming projects.'
    })
];
