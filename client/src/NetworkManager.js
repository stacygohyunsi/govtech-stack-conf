
class NetworkManager {
  static createTicket() {
    return new Promise((resolve, reject) => {
			fetch(`/api/createticket`, {
				method: 'POST', 
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				}
			})
			.then(res => res.json())
			.then(result => {
				if (result.err) {
					reject(result.err);
				}
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(err);
			});
    });
	}

  static postTicket(jwt) {
		return new Promise((resolve, reject) => {
			fetch(`https://stack-conf-jwt.herokuapp.com/api/park/entries`, {
				method: 'POST', 
				headers: {
					Authorization: 'Bearer ' + jwt
				}
			})
			.then(res => res.json())
			.then(payload => {
				resolve(payload);
			}).catch((err) => {
				console.log(err);
				reject(err);
			});	
		});
	}
}

export default NetworkManager;