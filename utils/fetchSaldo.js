const axios = require('axios')
const querystring = require('querystring')
const parseString = require('xml2js').parseString

exports.fetchSaldo = (kpj) => {
  const ranNumber = Math.random()
  const url = `http://smile.bpjsketenagakerjaan.go.id/smile/mod_kn/ajax/kn5004_grid_tk_aktif_query.php?${ranNumber}`
  const payload = {
    'TYPE': "getTK",
    'SEARCHA': "sc_kpj",
    'SEARCHB': kpj
  }
  
  return new Promise((resolve, rejects) => {
    axios.post(url, querystring.stringify(payload))
      .then((response) => {
          const data = JSON.parse(response.data.substring(71))
          let statusAktif = undefined
          if (data.length > 0) {
            const aktif = data.filter(keps => keps.AKTIF === "Y")
            aktif.length > 0
              ? statusAktif = "Y"
              : statusAktif = "N"
            const kode_perusahaan = data[0].KODE_PERUSAHAAN
            const kode_tk = data[0].KODE_TK
            const namaLengkap = data[0].NAMA_LENGKAP
            let url = `http://rptserver.bpjsketenagakerjaan.go.id/reports/rwservlet/setauth?button=Submit&username=smile&password=smilekanharimu&authtype=D&mask=GQ%253D%253D&isjsp=no&database=dboltp&nextpage=destype%3Dcache%26desformat%3DXML%26report%3DKNR3314.rdf%26userid%3D%2Fdata%2Freports%2Fkn%26P_KODE_SEGMEN%3D%27PU%27%26P_TAHUN%3D%272020%27%26P_KODE_PERUSAHAAN%3D%27${kode_perusahaan}%27%26P_KODE_TK%3D%27${kode_tk}%27%26P_USER%3D%27AK153580%27%26`
            axios.get(url)
              .then((res) => {
                parseString(res.data, (err, result) => {
                  const payLoad = {
                    namaLengkap,
                    statusAktif,
                    saldo: parseFloat(result.KNR3314.CS_3[0])
                  }
                  resolve(payLoad)
                })
              })
              .catch((error) => {
                rejects(error)
              })
          } else {
            rejects("Data tidak ditemukan")
          }
      })
      .catch((error) => {
        rejects(error)
      })
  })
  
}