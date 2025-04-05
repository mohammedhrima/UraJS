import enquirer from 'enquirer';

const { Select, Input, Toggle } = enquirer;

async function askQuestions() {
    const name = await new Input({
        name: 'name',
        message: 'What is your name?'
    }).run();

    const framework = await new Select({
        name: 'framework',
        message: 'Pick a framework',
        choices: ['React', 'Vue', 'Svelte']
    }).run();

    const useTypeScript = await new Toggle({
        name: 'typescript',
        message: 'Use TypeScript?',
        enabled: 'Yes',
        disabled: 'No'
    }).run();

    console.log('\n✅ Summary:');
    console.log('Name:', name);
    console.log('Framework:', framework);
    console.log('Use TypeScript:', useTypeScript ? 'Yes' : 'No');
}

askQuestions().catch(console.error);
