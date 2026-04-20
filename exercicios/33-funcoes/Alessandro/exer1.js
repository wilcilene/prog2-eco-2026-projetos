/*Crie uma função apresentar que receba nome, curso e de>semestre (padrão: 1) e retorne uma string formatada com template literal. Exemplos de saída esperada:

    apresentar("Ana", "Eng. Computação", 3) → "Ana – Eng. Computação – 3º semestre"
    apresentar("João", "Eng. Computação") → "João – Eng. Computação – 1º semestre"

Desafio: reescreva a função como arrow function.*/



function apresentar(nome, curso, semestre){


return console.log("Nome: " + nome + "-" + "Curso: " + curso + "-" + semestre + "° Semestre");

}

apresentar("Alessandro dos Santos", "Engenharia de Computação", 3);