class InfinityError extends Error {
    get status_code() { return 500; }
    get code() { return 10; }
    get params() { return {}; }
    get json() {
        return {
            code: this.code,
            error: this.message,
            params: this.params,
        };
    }
}
class InfinityEmptyBodyError extends InfinityError {
    constructor() {
        super('body data not found')
        this.name = this.constructor.name;
    }

    get status_code() { return 403; }
    get code() { return 20; }
}


class InfinityInvalidFormatError extends InfinityError {
    constructor(value, format, err) {
        super(`${value}  is in the wrong format \`${format}\``);
        this.name = this.constructor.name;
    }

    get status_code() { return 400; }
    get code() { return 30; }
}

class InfinityKeyExistError extends InfinityError {
    constructor(id) {
        super(`value already exists. key = \`${id}\``);
        this.name = this.constructor.name;
    }

    get status_code() { return 403; }
    get code() { return 40; }
}

class InfinityNotFoundError extends InfinityError {
    constructor(name) {
        super(`Key not found. key = \`${name}\``);
        this.name = this.constructor.name;
    }

    get status_code() { return 404; }
    get code() { return 50; }
}

class InfinityUserFoundError extends InfinityError {
    constructor(user) {
        super(`user not found. user = \`${user}\``);
        this.name = this.constructor.name;
    }

    get status_code() { return 403; }
    get code() { return 60; }
}

class InfinityRegistrationError extends InfinityError {
    constructor(user, err) {
        super(`user registration failed. user = \`${user}\`\n\`${err}\'`);
        this.name = this.constructor.name;
    }

    get status_code() { return 403; }
    get code() { return 70; }
}

// class KinLayerNotFoundError extends KinError {
//     constructor(layer_id) {
//         super(`layer \`${layer_id}\` not found`);
//         this.name = this.constructor.name;
//         this._layer_id = layer_id;
//     }

//     get status_code() { return 404; }
//     get code() { return 90; }
//     get params() {
//         return {
//             layer_id: this._layer_id,
//         };
//     }
// }
module.exports = {
    InfinityError,
    InfinityEmptyBodyError,
    InfinityInvalidFormatError,
    InfinityKeyExistError,
    InfinityNotFoundError,
    InfinityUserFoundError,
    InfinityRegistrationError
};