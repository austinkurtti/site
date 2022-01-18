export class SkillModel {
    name: string;
    icon: string;
    color: string;

    constructor(options?: Partial<SkillModel>) {
        if (options) {
            Object.assign(this, options);
        }
    }
}

export const skills: SkillModel[] = [
    new SkillModel({
        name: 'HTML5',
        icon: 'devicon-html5-plain'
    }),
    new SkillModel({
        name: 'Angular',
        icon: 'devicon-angularjs-plain'
    }),
    new SkillModel({
        name: 'Visual Studio Code',
        icon: 'devicon-vscode-plain'
    }),
    new SkillModel({
        name: 'TypeScript',
        icon: 'devicon-typescript-plain'
    }),
    new SkillModel({
        name: 'CSS3',
        icon: 'devicon-css3-plain'
    }),
    new SkillModel({
        name: 'C#',
        icon: 'devicon-csharp-plain'
    }),
    new SkillModel({
        name: '.NET',
        icon: 'devicon-dot-net-plain'
    }),
    new SkillModel({
        name: 'Git',
        icon: 'devicon-git-plain'
    }),
    new SkillModel({
        name: 'Visual Studio',
        icon: 'devicon-visualstudio-plain'
    }),
    new SkillModel({
        name: 'MySQL',
        icon: 'devicon-mysql-plain'
    }),
    new SkillModel({
        name: 'Bootstrap',
        icon: 'devicon-bootstrap-plain'
    }),
    new SkillModel({
        name: 'Windows',
        icon: 'devicon-windows8-plain'
    }),
    new SkillModel({
        name: 'Bitbucket',
        icon: 'devicon-bitbucket-plain'
    }),
    new SkillModel({
        name: 'PHP',
        icon: 'devicon-php-plain'
    }),
    new SkillModel({
        name: 'JavaScript',
        icon: 'devicon-javascript-plain'
    }),
    new SkillModel({
        name: 'Sass',
        icon: 'devicon-sass-plain'
    }),
    new SkillModel({
        name: 'NodeJS',
        icon: 'devicon-nodejs-plain'
    }),
    new SkillModel({
        name: 'Confluence',
        icon: 'devicon-confluence-plain'
    }),
    new SkillModel({
        name: 'GitHub',
        icon: 'devicon-github-plain'
    }),
    new SkillModel({
        name: 'Jira',
        icon: 'devicon-jira-plain'
    })
];
