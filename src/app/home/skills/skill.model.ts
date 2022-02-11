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
        icon: 'fab fa-html5'
    }),
    new SkillModel({
        name: 'Angular',
        icon: 'fab fa-angular'
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
        icon: 'fab fa-css3-alt'
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
        icon: 'fab fa-git-alt'
    }),
    new SkillModel({
        name: 'Visual Studio',
        icon: 'devicon-visualstudio-plain'
    }),
    new SkillModel({
        name: 'SQL',
        icon: 'fas fa-database'
    }),
    new SkillModel({
        name: 'Bootstrap',
        icon: 'fab fa-bootstrap'
    }),
    new SkillModel({
        name: 'Windows',
        icon: 'fab fa-windows'
    }),
    new SkillModel({
        name: 'Bitbucket',
        icon: 'fab fa-bitbucket'
    }),
    new SkillModel({
        name: 'PHP',
        icon: 'fab fa-php'
    }),
    new SkillModel({
        name: 'JavaScript',
        icon: 'fab fa-js'
    }),
    new SkillModel({
        name: 'Sass',
        icon: 'fab fa-sass'
    }),
    new SkillModel({
        name: 'NodeJS',
        icon: 'fab fa-node-js'
    }),
    new SkillModel({
        name: 'Confluence',
        icon: 'fab fa-confluence'
    }),
    new SkillModel({
        name: 'GitHub',
        icon: 'fab fa-github'
    }),
    new SkillModel({
        name: 'Jira',
        icon: 'fab fa-jira'
    })
];
