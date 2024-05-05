const newUserValidator = (req, res, next) => {
    const emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const { email, role , phone} = req.body;
    if (!emailRegex.test(email)) {
        return res.status(422).json({ error: "Invalid email!" });
    }

    if (role != 'user' && role != 'admin' && role != 'owner') {
        return res.status(422).json({ error: "Invalid assigned role!" });
    }

    if(isNaN(Number(phone))){
        return res.status(422).json({ error: "Invalid phone number!" });
    }

    next();
};

module.exports = {
    newUserValidator
}