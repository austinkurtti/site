/* eslint-disable max-len */
export class TimelineEventModel {
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
        startDate: new Date(2014, 1),
        endDate: new Date(2017, 2),
        name: 'AllofE Solutions',
        description: 'The first job I had in the web development space was an internship with AllofE Solutions in Lawrence, Kansas. ' +
                     'My biggest projects were in the design and implementation of new interfaces for their brand new product suite, eMedley. ' +
                     'I also helped maintain legacy code with bug fixes, managed diverse databases, and contributed to upgrades of internal intranet tools.' +
                     '<br><br>' +
                     'I really enjoyed working with such a tight-knit group of developers. ' +
                     'My time at AllofE provided invaluable experience for academic work and translated into a solid foundation from which to launch my career.'
    }),
    new TimelineEventModel({
        startDate: new Date(2017, 4),
        name: 'University of Kansas',
        description: 'Graduated from KU with a B.S. in Computer Science.'
    }),
    new TimelineEventModel({
        startDate: new Date(2017, 5),
        endDate: new Date(),
        name: 'Lockpath',
        description: 'Fresh out of college, I took a job as a Sofware Engineer with Lockpath. ' +
                     'On day one I joined the back-end team and developed a good understanding of the business logic behind the flagship, Keylight. ' +
                     'After several months I transitioned into front-end work to help with a crucial UI/UX overhaul involving converting the Keylight app to Angular.' +
                     '<br><br>' +
                     'I continue to be involved in the ongoing Angular conversion, while also contribute to building out the assocated REST API endpoints. ' +
                     'More recently I have helped with developer onboarding, guiding new coding standards, and defining front-end architecture.'
    }),
    new TimelineEventModel({
        startDate: new Date(2019, 7),
        name: 'NAVEX Global Acquistion',
        description: 'Lockpath is acquired by NAVEX Global, a company based out of Lake Oswego, Oregon.'
    }),
    new TimelineEventModel({
        startDate: new Date(2022, 0),
        name: 'NAVEX Rebrand',
        description: 'NAVEX Global rebrands, shortening their name to NAVEX.'
    })
];
