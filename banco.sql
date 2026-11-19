CREATE TABLE IF NOT EXISTS baralho (
  id INT PRIMARY KEY,
  nome VARCHAR(50) NOT NULL,
  img TEXT,
  cp INT,
  treinador VARCHAR(50)
)

-- Listar o baralho salvo e ordenar pelo ID --

-- Conta quantos pokemons estão no baralho --
Select COUNT(*):: Int AS total FROM baralho
