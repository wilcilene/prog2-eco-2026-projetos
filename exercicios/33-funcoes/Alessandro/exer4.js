function criarSaudacao(idioma) {
	return function(nome) {
		if (idioma === "pt") {
			console.log(`Olá, ${nome}!`);
		} else if (idioma === "en") {
			console.log(`Hello, ${nome}!`);
		} else if (idioma === "es") {
			console.log(`¡Hola, ${nome}!`);
		} else {
			console.log(`Idioma não suportado: ${nome}`);
		}
	};
}