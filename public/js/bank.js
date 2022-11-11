function fSubmitLogout() {

    document.getElementById("frmBankLanding").action = "/logout";
    document.getElementById("frmBankLanding").submit();
}

function fSelectBankingOption() {

    if (document.getElementById("rdoopenaccount").checked)
        document.getElementById("txtid").disabled = true;
    else
        document.getElementById("txtid").disabled = false;
}

function fnDisableKeys(evt) {         

    evt = (evt) ? evt : window.event;
    let charCode = (evt.which) ? evt.which : evt.keycode;

    if (
        charCode == 36 ||               
        charCode == 45 ||               
        charCode == 46)                 
        return false;
}

function fnInputCharacters(evt) {      

    evt = (evt) ? evt : window.event;
    let charCode = (evt.which) ? evt.which : evt.keycode;

    let strAmount = document.getElementById("txtamount").value;
    let searchDecimalIndex = strAmount.lastIndexOf(".");
    let numberOfDecimalDigits = (searchDecimalIndex >= 0) ? (strAmount.length - 1) - searchDecimalIndex : 0;
    if ((charCode >= 48 && charCode <= 57) || charCode == 46) {
        if (charCode == 46)
            if (searchDecimalIndex < 0)
                return true;
            else 
                return false;

        if ((charCode >= 48 && charCode <= 57) && numberOfDecimalDigits < 2)
            return true;
        else
            return false;
    }
    else
        return false;
}

function fnEnterAmount() {
    if (!(isNaN(document.getElementById("txtamount").value)) &&
        parseFloat(document.getElementById("txtamount").value, 10) > 0)
        document.getElementById("btnSubmit").disabled = false;
}

function fSelectBankingOption() {

    if (document.getElementById("rdochequing").checked ||
        document.getElementById("rdosavings").checked)
        document.getElementById("btnSubmit").disabled = false;
}