class DataService {
  getData(){
      return fetch('/api/datasourcestructure', {
        method : "GET",
      })
      .then((response) => {
          if (!response.ok) {
              throw new Error(response.error)
          }
          return response.json();
      })
    }
  
  postSQL(data){
    return fetch('api/parametrizedQuery', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then((response) => {
      if (!response.ok) {
          throw new Error(response.error)
      }
      return response.json();
  })
  }

  login(data){
    return fetch('api/login', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then((response) => {
      if (!response.ok) {
          throw new Error(response.error)
      }
      return response.json();
    })
  }

  getHistory(){
    return fetch('api/sqlhistory/?id=1', {
      method : "GET",
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(response.error)
        }
        return response.json();
    })
  }

  postBucket(data){
    return fetch('api/bucketdata', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then((response) => {
      if (!response.ok) {
          throw new Error(response.error)
      }
      return response.json();
  })
  }

  getBucketData(){
      return fetch('api/bucketdata/?id=1', {
        method : "GET",
      })
      .then((response) => {
          if (!response.ok) {
              throw new Error(response.error)
          }
          return response.json();
      })
  }
  visualizeComponent(id){
    return fetch('api/visualizationdata?bucketDataId='+id, {
        method : "GET",
      })
      .then((response) => {
          if (!response.ok) {
              throw new Error(response.error)
          }
          return response.json();
      })
  }
  

  getFolders(){
    return fetch('api/folder', {
      method : "GET",

    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(response.error)
        }
        return response.json();
    })
  }

  removeFolder(id){
    return fetch('api/folder', {
      method : "DELETE",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(id),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(response.error)
        }
        return response;
    })
  }


  getReports(id){
    return fetch('api/folder?id='+id, {
      method : "GET",
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(response.error)
        }
        return response.json();
    })
  }

  getReport(id){
    return fetch('api/report?id='+id, {
      method : "GET",
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(response.error)
        }
        return response.json();
    })
  }

  deleteReport(id){
    return fetch('api/report', {
      method : "DELETE",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(id),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(response.error)
        }
        return response;
    })
  }


  getDropDownData({kolona,parent}){
    return fetch('api/distinctColumnValues?table=' + parent + '&column=' + kolona, {
      method : "GET",
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(response.error)
        }
        return response.json();
    })
  }

  removeBucketData(id){
    return fetch('api/bucketdata/?id='+id, {
      method : "DELETE",
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(response.error)
        }
        return response.status;
    })
  }

  postReport(data){
    return fetch('api/report', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then((response) => {
      if (!response.ok) {
          throw new Error(response.error)
      }
      return response.json();
  })
  }

  putFolder(data){
    return fetch('api/folder', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then((response) => {
      if (!response.ok) {
          throw new Error(response.error)
      }
      return response;
  })
  }


  updateReport(data){
    return fetch('api/report', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then((response) => {
      if (!response.ok) {
          throw new Error(response.error)
      }
      return response;
    })
  }

  postFolder(data){
    return fetch('api/folder', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then((response) => {
      if (!response.ok) {
          throw new Error(response.error)
      }
      return response;
    })
  }

  getFrame(hash){
    return fetch('/api/reporthash?id=' + hash, {
      method : "GET",
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(response.error)
        }
        return response.json();
    })
  }

}

export default new DataService();
