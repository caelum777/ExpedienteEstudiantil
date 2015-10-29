jQuery(function($) {
    $(document).on('click', '#fecha_de_nacimiento', function () {
        var me = $("#fecha_de_nacimiento");
        me.datepicker({
            showOn: 'focus',
            altFormat: "dd/mm/yy",
            dateFormat: "dd/mm/yy",
            minDate: new Date(1980, 1 - 1, 1),
            changeMonth: true,
            changeYear: true
        }).focus();
        me.mask('99/99/9999');
    });
});
