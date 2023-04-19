function Validator(options) {

    function getParent(element, selector) {
        while(element.parentElement) {
            if(element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    //Lấy element của form cần validate
    var formElement = document.querySelector(options.form);

    var selectorRules = {};
    
    //Hàm thực hiện validate
    function validate(inputElement, rule) {
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
        //value: inputElement.value
        //test func: rule.test
        var errorMessage;

        //Lấy ra các rules của selector
        var rules = selectorRules[rule.selector];

        //Lặp qua từng rule & kiểm tra
        //Nếu có lỗi thì dừng việc kiểm tra
        for(var i = 0; i < rules.length; ++i) {
            switch(inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](formElement.querySelector(rule.selector + ':checked'));
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);
            }
            if(errorMessage) break;
        }
        
        if (errorMessage) {
            errorElement.innerText = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add('invalid');
        } else {
            errorElement.innerText = '';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
        }

        return !errorMessage;
    }
    
    if (formElement) {
        // Nhẫn vào Submit và xử lý
        formElement.onsubmit = (e) => {
            e.preventDefault();

            var isFormValid = true;

            //Lặp qua từng rule & vadidate all
            options.rules.forEach((rule) => {
                var inputElement = formElement.querySelector(rule.selector);

                var isValid = validate(inputElement, rule);
                if(!isValid) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                //Trường hợp submit với JavaScript
                if (typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]');
            
                    var formValues = Array.from(enableInputs).reduce(function (values, input) {
                        
                        switch (input.type) {
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                                break;

                            case 'checkbox':
                                if(!input.checked) { 
                                    return values;
                                }
                                if(!values[input.name]) {
                                    values[input.name] = '';
                                }
                                if(!Array.isArray(values[input.name])) {
                                    values[input.name] = [];
                                } 
                                values[input.name].push(input.value);
                                break;

                            case 'file':
                                values[input.name] = input.files;
                                break;
                                    
                            default:
                                values[input.name] = input.value;
                        }

                        return values;
                    }, {});

                    options.onSubmit(formValues);
                    
                } else { // Submit với hành vi mặc định
                    formElement.submit();
                }
            }
        }
    

        //Lặp qua mỗi rule và xử lý
        options.rules.forEach((rule) => {

            // Lưu lại các rules cho mỗi input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            var inputElements = formElement.querySelectorAll(rule.selector);

            Array.from(inputElements).forEach(function(inputElement) {
                // Xử lý trường hợp blur ra khỏi input
                inputElement.onblur = () => {
                    validate(inputElement, rule);
                }
    
                    // Xử lý mỗi khi người dùng nhập lại
                inputElement.oninput = () => {
                    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
                }  
            });

        });
    }
}

//Định nghĩa các rules
/* Nguyễn tắc của các rules:
1. Khi có lỗi => trả ra message lối
2. Khi hợp lệ => không trả ra gì cả
 */
Validator.isRequired = function(selector, message) {
    return {
        selector,
        test: (value) => {
            return value ? undefined: message || 'Vui lòng nhập trường này';
        }
    }
}

Validator.isPhoneNumber = function(selector, minLength, maxLength, message) {
    return {
        selector,
        test: (value) => {
            return (value.length >= minLength && value.length <= maxLength && !isNaN(value)) ? undefined : message || `Vui lòng nhập số điện thoại hợp lệ`;
        }
    }
}

Validator.isConfirmed = function(selector, getConfirmValue, message) {
    return {
        selector,
        test: (value) => {
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác';
        }
    }
}
