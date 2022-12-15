const { v4: uuidv4 } = require('uuid')
const unirest = require('unirest')
const repository = require('../../../repository/postgresql')
const {
  baseResponse, errorResponse, paginationResponse, dynamicFilter
} = require('../../../utils')
const { lang } = require('../../../lang')

const blocking = async (req) => {
  const where = {
    id: req?.params?.id
  }
  await repository.todoPostgres.update({ total: 8 }, where)
  setTimeout(async () => {
    await repository.todoPostgres.update({ total: 12 }, where)
  }, 3000);
  setTimeout(async () => {
    await repository.todoPostgres.update({ total: 1 }, where)
  }, 2000);
  setTimeout(async () => {
    await repository.todoPostgres.update({ total: 3 }, where)
  }, 3000);
  setTimeout(async () => {
    await repository.todoPostgres.update({ total: 4 }, where)
  }, 3000);
  setTimeout(async () => {
    await repository.todoPostgres.update({ total: 5 }, where)
  }, 3000);
}

const store = async (req, res) => {
  const payload = req.body
  payload.id = uuidv4()

  try {
    const result = await repository.todoPostgres.create(payload)
    baseResponse(res, lang.__('created.success'), lang.__('created'), result)
  } catch (error) {
    errorResponse(res, error)
  }
}

const show = async (req, res) => {
  try {
    const where = dynamicFilter(req.query, 'or')
    const result = await repository.todoPostgres.read(where)
    return paginationResponse(req, res, result)
  } catch (error) {
    return errorResponse(res, error)
  }
}

// eslint-disable-next-line consistent-return
const showNBA = async (req, res) => {
  try {
    let data = null
    unirest('GET', 'https://v2.nba.api-sports.io/games?date=2022-12-11')
      .headers({
        'x-rapidapi-key': 'b8604c77b4bda3d1366fa24031e8800a',
        'x-rapidapi-host': 'v2.nba.api-sports.io'
      })
      // eslint-disable-next-line prefer-arrow-callback
      .end(function (res2) {
        if (res2.error) throw new Error(res2.error)
        data = JSON.parse(res2.raw_body)
        console.log(`data222:${data}`)
        return baseResponse(res, lang.__('get.success'), lang.__('success'), data)
      })
    // console.log(res)
    // console.log(res.body)
  } catch (error) {
    return errorResponse(res, error)
  }
}

const showByParam = async (req, res) => {
  try {
    const where = {
      id: req?.params?.id
    }
    const result = await repository.todoPostgres.readByParam(where)
    if (result) {
      return baseResponse(res, lang.__('get.success'), lang.__('success'), result)
    }
    return baseResponse(res, lang.__('not_found.id', { id: where.id }), lang.__('not_found'), result)
  } catch (error) {
    return errorResponse(res, error)
  }
}

const update = async (req, res) => {
  try {
    const where = {
      id: req?.params?.id
    }
    const result = await repository.todoPostgres.update(req.body, where)
    const data = result[1][0]
    if (result[0]) {
      return baseResponse(res, lang.__('updated.success', { id: where.id }), lang.__('success'), data)
    }
    return baseResponse(res, lang.__('not_found.id', { id: where.id }), lang.__('not_found'), [])
  } catch (error) {
    return errorResponse(res, error)
  }
}

const hardDelete = async (req, res) => {
  try {
    const where = {
      id: req?.params?.id
    }
    const result = await repository.todoPostgres.hardDelete(where)
    if (result) {
      return baseResponse(res, lang.__('not_found.id', { id: where.id }), lang.__('success'), result)
    }
    return baseResponse(res, lang.__('not_found.id', { id: where.id }), lang.__('not_found'), result)
  } catch (error) {
    return errorResponse(res, error)
  }
}

module.exports = {
  store,
  show,
  showNBA,
  showByParam,
  update,
  hardDelete,
  blocking,
}
