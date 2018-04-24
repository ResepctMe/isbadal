
/*
 * Display a descriptive tooltip
 */
function DisplayTooltip() {
    var $this = $(this), // element hovered
        $ttwrapper = $('#icon_tooltip'), // tooltip div
        $ttspan = $ttwrapper.find('.tt-text'), // tooltip text
        ttclass = ($this.data('ttClass')) ? $this.data('ttClass').toString() : '',
        $tttype = $ttwrapper.find('.tt-type'),
        tttypecontent = (ttclass === "tt-warn") ? "!" : "i",
        tt_text = ($this.data('ttText')) ? $this.data('ttText').toString().replace(/\\n/g, '\n') : '...Something helpful!', // text to display in tooltip, supporting '\n' as line breaks
        tt_pos = ($this.data('ttPosition')) ? $this.data('ttPosition').toString() : '', // requested position of tooltip (x:left/center/right - y:top/middle/bottom)
        arrTtPos = tt_pos.split(' '),
        ttPosY = arrTtPos[0],
        ttPosX = arrTtPos[1],
        interval = 150;

    $tttype.text(tttypecontent);

    $ttwrapper.attr('class', ttclass); // apply class
    $ttspan.text(tt_text); // set text

    var x = 0,
        y = 0,
        x_offset = (ttPosX === "right") ? 10 : -10,
        y_offset = (ttPosY === "bottom") ? 10 : -10,
        bX = $this.offset().left,
        bY = $this.offset().top,
        bW = $this.outerWidth(),
        bH = $this.outerHeight(),
        ttW = $ttwrapper.outerWidth(),
        ttH = $ttwrapper.outerHeight();

    // calc x pos
    if (ttPosX === "right") x = bX + bW + x_offset;
    else if (ttPosX === "center") x = bX - ((ttW - bW) / 2);
    else x = bX - ttW + x_offset; // left - default

    // calc y pos
    if (ttPosY === "bottom") y = bY + bH + y_offset;
    else if (ttPosY === "middle") y = bY - ((ttH - bH) / 2);
    else y = bY - ttH + y_offset; // top - default

    $ttwrapper.css({ 'top': y + 'px', 'left': x + 'px' }).stop(true, true).fadeIn(interval);
};



/**
 * Hide tab menu tooltip
 */
function HideTooltip() {
    var $ttwrapper = $('#icon_tooltip');
    $ttwrapper.fadeOut(150);
};

$('#container').on('mouseenter', '.has-tt', DisplayTooltip);
$('#container').on('mouseleave', '.has-tt', HideTooltip);

