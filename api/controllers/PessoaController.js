const dataBase = require('../models');
const Sequelize = require('sequelize');

class PessoaController {
  static async pegaPessoasAtivas(req, res) {
    try {
      const pessoasAtivas = await dataBase.Pessoas.findAll();
      return res.status(200).json(pessoasAtivas);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async pegaTodasAsPessoas(req, res) {
    try {
      const todasAsPessoas = await dataBase.Pessoas.scope('todos').findAll();
      return res.status(200).json(todasAsPessoas);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async pegaUmaPessoa(req, res) {
    try {
      const { id } = req.params;
      const umaPessoa = await dataBase.Pessoas.findOne({
        where: { id: Number(id) }
      });
      return res.status(200).json(umaPessoa);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async criaPessoa(req, res) {
    const novaPessoa = req.body;
    try {
      const novaPessoaCriada = await dataBase.Pessoas.create(novaPessoa);
      return res.status(200).json(novaPessoaCriada);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async atualizaPessoa(req, res) {
    const novasInfos = req.body;
    const { id } = req.params;
    try {
      await dataBase.Pessoas.update(novasInfos, { where: { id: Number(id) } });
      const pessoaAtualizada = await dataBase.Pessoas.findOne({
        where: { id: Number(id) }
      });
      return res.status(200).json(pessoaAtualizada);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async deletaPessoa(req, res) {
    const { id } = req.params;
    try {
      await dataBase.Pessoas.destroy({ where: { id: Number(id) } });
      return res.status(200).json({ mensagem: `id ${id} foi deletado!` });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async restauraPessoa(req, res) {
    const { id } = req.params;
    try {
      await dataBase.Pessoas.restore({ where: { id: Number(id) } });
      return res.status(200).json({ mensagem: `id ${id} restaurado.` });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  // MATRICULAS
  //http://localhost:3000/pessoas/1/matricula/5
  //http://localhost:3000/pessoas/:estudanteId/matricula/:matriculaId
  static async pegaUmaMatricula(req, res) {
    try {
      const { estudanteId, matriculaId } = req.params;
      const umaMatricula = await dataBase.Matriculas.findOne({
        where: {
          id: Number(matriculaId),
          estudante_id: Number(estudanteId)
        }
      });
      return res.status(200).json(umaMatricula);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async criaMatricula(req, res) {
    const { estudanteId } = req.params;
    const novaMatricula = { ...req.body, estudante_id: Number(estudanteId) };
    try {
      const novaMatriculaCriada = await dataBase.Matriculas.create(
        novaMatricula
      );
      return res.status(200).json(novaMatriculaCriada);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async atualizaMatricula(req, res) {
    const { estudanteId, matriculaId } = req.params;
    const novasInfos = req.body;
    const { id } = req.params;
    try {
      await dataBase.Matriculas.update(novasInfos, {
        where: { id: Number(matriculaId), estudante_id: Number(estudanteId) }
      });
      const matriculaAtualizada = await dataBase.Matriculas.findOne({
        where: { id: Number(matriculaId) }
      });
      return res.status(200).json(matriculaAtualizada);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async deletaMatricula(req, res) {
    const { matriculaId } = req.params;
    try {
      await dataBase.Matriculas.destroy({ where: { id: Number(matriculaId) } });
      return res
        .status(200)
        .json({ mensagem: `id ${matriculaId} foi deletado!` });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async pegaMatriculas(req, res) {
    const { estudanteId } = req.params;
    try {
      const pessoa = await dataBase.Pessoas.findOne({
        where: { id: Number(estudanteId) }
      });
      const matriculas = await pessoa.getAulasMatriculadas();
      return res.status(200).json(matriculas);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async pegaMatriculasPorTurma(req, res) {
    const { turmaId } = req.params;
    try {
      const todasAsMatriculas = await dataBase.Matriculas.findAndCountAll({
        where: { turma_id: Number(turmaId), status: 'confirmado' },
        limit: 20,
        order: [['estudante_id', 'DESC']]
      });
      return res.status(200).json(todasAsMatriculas);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async pegaTurmasLotadas(req, res) {
    const lotacaoTurma = 2;
    try {
      const turmasLotadas = await dataBase.Matriculas.findAndCountAll({
        where: { status: 'confirmado' },
        attributes: ['turma_id'],
        group: ['turma_id'],
        having: Sequelize.literal(`count(turma_id) >= ${lotacaoTurma}`)
      });
      return res.status(200).json(turmasLotadas.count);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async cancelaPessoa(req, res) {
    const { estudanteId } = req.params;
    try {
      await dataBase.Pessoas.update(
        { ativo: false },
        { where: { id: Number(estudanteId) } }
      );
      await dataBase.Matriculas.update(
        { status: 'cancelado' },
        { where: { estudante_id: Number(estudanteId) } }
      );
      return res
        .status(200)
        .json({
          mensagem: `matrícula ref. estudante ${estudanteId} cancelada.`
        });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
}

module.exports = PessoaController;
