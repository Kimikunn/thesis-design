function check(form) {
    var reg = /^\s*|\s*$/g;
    if (form.username.value.replace(reg, '') == "") {
        alert("请输入用户名");
        form.username.focus();
        return false;
    }
    else if (form.password.value.replace(reg, '') == "") {
        alert("请输入密码");
        form.password.focus();
        return false;
    }
    else {
        return true;
    }
}