export enum SkillType {
    front = 1 << 1,
    back  = 1 << 2,
    data  = 1 << 3,
    tool  = 1 << 4
}

export class SkillModel {
    public name: string;
    public icon: string;
    public type: SkillType;

    constructor(partial?: Partial<SkillModel>) {
        if (partial) {
            Object.assign(this, partial);
        }
    }
}

export const skills: SkillModel[] = [
    new SkillModel({
        name: '.NET',
        icon: 'devicon-dot-net-plain',
        type: SkillType.back
    }),
    new SkillModel({
        name: 'Angular',
        icon: 'fab fa-angular',
        type: SkillType.front
    }),
    new SkillModel({
        name: 'Bootstrap',
        icon: 'fab fa-bootstrap',
        type: SkillType.front
    }),
    new SkillModel({
        name: 'C#',
        icon: 'devicon-csharp-plain',
        type: SkillType.back
    }),
    new SkillModel({
        name: 'Confluence',
        icon: 'fab fa-confluence',
        type: SkillType.tool
    }),
    new SkillModel({
        name: 'CSS3',
        icon: 'fab fa-css3-alt',
        type: SkillType.front
    }),
    new SkillModel({
        name: 'D3.js',
        icon: 'devicon-d3js-plain',
        type: SkillType.front
    }),
    new SkillModel({
        name: 'Git',
        icon: 'fab fa-git-alt',
        type: SkillType.tool
    }),
    new SkillModel({
        name: 'HTML5',
        icon: 'fab fa-html5',
        type: SkillType.front
    }),
    new SkillModel({
        name: 'Jira',
        icon: 'fab fa-jira',
        type: SkillType.tool
    }),
    new SkillModel({
        name: 'MySQL',
        icon: 'devicon-mysql-plain',
        type: SkillType.data
    }),
    new SkillModel({
        name: 'PHP',
        icon: 'fab fa-php',
        type: SkillType.back
    }),
    new SkillModel({
        name: 'Sass',
        icon: 'fab fa-sass',
        type: SkillType.front
    }),
    new SkillModel({
        name: 'SQL Server',
        icon: 'devicon-microsoftsqlserver-plain',
        type: SkillType.data
    }),
    new SkillModel({
        name: 'Typescript',
        icon: 'devicon-typescript-plain',
        type: SkillType.front
    }),
    new SkillModel({
        name: 'Visual Studio',
        icon: 'devicon-visualstudio-plain',
        type: SkillType.tool
    }),
    new SkillModel({
        name: 'Visual Studio Code',
        icon: 'devicon-vscode-plain',
        type: SkillType.tool
    }),
    new SkillModel({
        name: 'Windows',
        icon: 'fab fa-windows',
        type: SkillType.tool
    })
];
