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
                     'My most notable projects were in the design and implementation of features for their brand new product suite, eMedley. ' +
                     'I also helped maintain legacy code with bug fixes, managed diverse databases, and contributed to upgrades of company intranet tools.' +
                     '<br><br>' +
                     'I really enjoyed working with such a tight-knit group of developers. ' +
                     'My time at AllofE provided invaluable experience for academic work and translated into a solid foundation from which to launch my career.'
    }),
    new TimelineEventModel({
        startDate: new Date(2017, 4),
        name: 'University of Kansas',
        description: 'Graduated from KU with a B.S. in Computer Science.' +
                     '<br><br>' +
                     'Rock Chalk!'
    }),
    new TimelineEventModel({
        startDate: new Date(2017, 5),
        endDate: new Date(),
        name: 'Lockpath',
        description: 'Fresh out of college, I took a job as a Software Engineer with Lockpath in Overland Park, Kansas. ' +
                     'On day one I joined the back-end team and developed a good understanding of the business logic behind Keylight, the flagship web app. ' +
                     'After several months, I transitioned into front-end work to help with a crucial UI/UX overhaul involving converting the Keylight app to Angular.' +
                     '<br><br>' +
                     'I continue to be involved in the ongoing Angular conversion while also contributing to building out the assocated REST API endpoints. ' +
                     'More recently, I have helped with developer onboarding, guiding new coding standards, and defining front-end architecture.'
    }),
    new TimelineEventModel({
        startDate: new Date(2019, 7),
        name: 'NAVEX Global Acquistion',
        description: 'Lockpath is acquired by NAVEX Global, a company based out of Lake Oswego, Oregon.' +
                     '<br><br>' +
                     'Keylight is renamed to Lockpath IRM.'
    }),
    new TimelineEventModel({
        startDate: new Date(2021, 5),
        name: 'Transition to Full-Time Remote',
        description: 'After more than a year of Covid-19 affecting most companies\' (including NAVEX) return to office plans, I decided to transition my role with NAVEX to full-time remote. ' +
                     'This gave me the freedom to live in other cities, and I chose to move to St Paul, Minnesota.'
    }),
    new TimelineEventModel({
        startDate: new Date(2022, 0),
        name: 'NAVEX Rebrand',
        description: 'NAVEX Global rebrands, shortening the company name to NAVEX.' +
                     '<br><br>' +
                     'Lockpath IRM is renamed to NAVEX IRM, under the NAVEX One Platform.'
    })
];
