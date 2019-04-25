$(document).ready(function () {

    $('#btn-add').click(function () {
        $('#txt-fadd').val(cleanAddress($('#txt-add').val()));
        $('#txt-fadd').select();
        document.execCommand('copy');
        $('#txt-add').focus();
    });

    $('#btn-stud-names').click(function () {
        $('#txt-fstd-names').val(cleanStudNames(trimFromNames($('#txt-std-names').val())));
        $('#txt-fstd-names').select();
        document.execCommand('copy');
        $('#txt-std-names').focus();
    });

    $('#btn-parent').click(function () {
        $('#txt-fparent').val(cleanParentNames(trimFromNames($('#txt-parent').val())));
        $('#txt-fparent').select();
        document.execCommand('copy');
        $('#txt-parent').focus();
    });

    $('#btn-dob').click(function () {
        $('#txt-fdob').val(cleanAndReformatDates($('#txt-dob').val()));
        $('#txt-fdob').select();
        document.execCommand('copy');
        $('#txt-dob').focus();
    });

    $('#btn-str-replace').click(function () {
        stringReplace();
    });

    $(document).on('input', '#txt-str-replace, #txt-replace-from, #txt-replace-to', function () {
        stringReplacePreview();
    });

    $(document).on('change', '#txt-ignore-case', function () {
        stringReplacePreview();
    });

    function cleanAndReformatDates(str) {
        let tempStr = str.replace(/ /g, '');
        tempStr = tempStr.replace(/[^\n\d]{1,99}/g, '-');

        let dobs = [];
        if (tempStr.indexOf('\n') >= 0) {
            dobs = tempStr.split('\n');
        } else {
            dobs.push(tempStr);
        }

        let finalStr = '';
        let date = new Date();
        dobs.forEach((el, i) => {
            el = el.trim();
            if (el == '') {
                finalStr += pad(date.getFullYear(), 4) + '-' + (pad(date.getMonth() + 1, 2)) + '-' + pad(date.getDate(), 2);
            } else {
                ''.sub
                let split = el.split('-');
                if (split.length >= 3) {
                    finalStr += pad(split[2], 4) + '-' + pad(split[1], 2) + '-' + pad(split[0], 2);
                } else {
                    finalStr += pad(date.getFullYear(), 4) + '-' + (pad(date.getMonth() + 1, 2)) + '-' + pad(date.getDate(), 2);
                }
            }
            if (i < dobs.length - 1) {
                finalStr += '\n';
            }
        });

        return finalStr;
    }

    function pad(num, size) {
        var s = num + "";
        while (s.length < size) {
            s = "0" + s;
        }

        if (size > 0 && s.length > size) {
            while (s.length > size) {
                s = s.substr(1);
            }
        }

        return s;
    }

    function cleanAddress(str, removeNewLines = 0) {
        // remove commas & replace with tabs
        let data = str.replace(/ *, */g, '\t').replace(/  */g, ' ');

        if (removeNewLines == 1) {
            data = data.replace(/\n\n*/g, '\n');
        }

        let addresses = data.split('\n');
        let finalAddress = '';
        addresses.forEach((el, i) => {
            let addSpl = [];
            el = el.trim();
            if (el.indexOf('\t') >= 0) {
                addSpl = el.split('\t');
            } else if (el.indexOf(' ') >= 0) {
                addSpl = el.split(' ');
            } else {
                addSpl.push(el);
            }

            if (addSpl.length > 0 && el.trim() !== '') {
                finalAddress += addSpl[0] + '\t';
                if (addSpl.length > 2) {
                    finalAddress += addSpl[1] + '\t';
                    finalAddress += addSpl[2];
                } else {
                    finalAddress += '.\t';
                    if (addSpl.length > 1) {
                        finalAddress += addSpl[1];
                    } else {
                        finalAddress += '.';
                    }
                }
            } else {
                finalAddress += '.\t.\t.';
            }
            if (i < addresses.length - 1)
                finalAddress += '\n';
        });

        return finalAddress;
    }

    function trimFromNames(str) {
        let retThis = str;
        retThis = retThis.replace(/((Mrs*\.*)|(Shri|Miss|Late|Master|Smt))\s*/gi, '');
        return retThis;
    }

    function cleanStudNames(str, removeNewLines = 0) {
        let data = str.replace(/  */g, ' ').replace(/ *\(/g, '(').replace(/\n\n*/g, '\n');

        if (removeNewLines == 1) {
            data = data.replace(/\n\n*/g, '\n');
        }

        let studNames = data.split('\n');
        let finalStudNames = '';
        studNames.forEach((el, i) => {
            let nameSpl = [];
            el = el.trim();
            if (el.indexOf('\t') >= 0) {
                nameSpl = el.split('\t');
            } else if (el.indexOf(' ') >= 0) {
                nameSpl = el.split(' ');
            } else {
                nameSpl.push(el);
            }

            if (nameSpl.length > 0 && el.trim() !== '') {
                finalStudNames += nameSpl[0] + '\t';
                if (nameSpl.length > 2) {
                    finalStudNames += nameSpl[1] + '\t';
                    finalStudNames += nameSpl[2];
                } else {
                    finalStudNames += '\t';
                    if (nameSpl.length > 1) {
                        finalStudNames += nameSpl[1];
                    }
                }
            } else {
                finalStudNames += '\t\t';
            }
            if (i < studNames.length - 1)
                finalStudNames += '\n';
        });

        let brackettedListOfCaps = ['rte', 'bpl', 'h']

        let retThis = ProperCase(finalStudNames);
        brackettedListOfCaps.forEach(el => {
            var regExp = new RegExp('\\b\\(' + el + '\\)', 'g');
            retThis = retThis.replace(regExp, '(' + el.toUpperCase() + ')');
        });

        return retThis;
    }

    function cleanParentNames(str) {
        let data = '' + str.replace(/  */g, ' ');
        let parentNames = [];
        if (data.indexOf('\n') >= 0) {
            parentNames = data.split('\n');
        } else {
            parentNames.push(data);
        }

        var finalNames = '';
        parentNames.forEach((el, i) => {
            el = el.trim();
            if (el == '') {
                finalNames += '.';
            } else {
                finalNames += el.trim();
            }
            if (i < parentNames.length - 1)
                finalNames += '\n';
        });

        return ProperCase(finalNames.trim());
    }

    function ProperCase(anyText) {
        var i, j, str, lowers, uppers;
        str = anyText.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });

        // Certain minor words should be left lowercase unless 
        // they are the first or last words in the string
        lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At',
            'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
        for (i = 0, j = lowers.length; i < j; i++)
            str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'),
                function (txt) {
                    return txt.toLowerCase();
                });

        // Certain words such as initialisms or acronyms should be left uppercase
        uppers = ['Id', 'Tv', 'Rte'];
        for (i = 0, j = uppers.length; i < j; i++)
            str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'),
                uppers[i].toUpperCase());

        return str;
    }

    function stringReplace() {
        let data = $('#txt-str-replace').val();
        var stringToSearch = $('#txt-replace-from').val();
        var regExp = new RegExp(stringToSearch, 'gm');
        $('#txt-str-replace').val(data.replace(regExp, $('#txt-replace-to').val()));
        stringReplacePreview();
    }

    function stringReplacePreview() {
        let data = $('#txt-str-replace').val();
        var stringToSearch = $('#txt-replace-from').val();
        let ignoreCase = false;
        if ($('#txt-ignore-case:checked').length > 0) {
            ignoreCase = true;
        }
        var regExp = new RegExp(stringToSearch, 'gm' + (ignoreCase ? 'i' : ''));
        var matches = data.match(regExp);
        if (!matches || stringToSearch.trim().length === 0) {
            matches = 0;
        } else {
            matches = matches.length;
        }
        $('#replace-str-matches').html('Matches : ' + matches);
        $('#txt-str-replace-preview').val(data.replace(regExp, $('#txt-replace-to').val()));
    }
});