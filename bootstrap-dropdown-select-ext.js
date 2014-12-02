/**
 * @name Twitter Bootstrap Dropdown Plugin Extension
 * This extension will add the "Select" capability to default Bootstrap's Dropdown
 * While it keep the default behavior of Twitter Bootstrap Dropdown like keys binding
 * 
 * @author anh.trinh
 * @website: http://trinhtrunganh.com
 *
 * @ussage
 *  - Add 'data-select="true"' to .dropdown-menu
 *  - After the item is selected, it will has the class 'selected', the menu will be updated
 *    with the selected value
 *  - 'selected.bs.dropdown' event will be triggered after selection is made
 * 
 * @example
 * ```html
 *   <div class="btn-group dropup">
 *     <button type="button" class="btn btn-default">Where value should be updated</button>
 *     <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
 *       <span class="caret"></span>
 *       <span class="sr-only">Toggle Dropdown</span>
 *     </button>
 *     <ul class="dropdown-menu" role="menu" data-select="true">
 *       <!-- Dropdown menu links -->
 *     </ul>
 *   </div>
 * ```
 */

(function ($) {

    var Dropdown = $.fn.dropdown.Constructor;
    var toggle   = '[data-toggle="dropdown"]';

    var getParent = function ($this) {
        return $this.parent();
    };

    /**
     * Select Handler
     * Will be trigger when user choose a menu item by 'Enter' key or 'click' to that item
     * 
     * The code is taken from the Dropdown.prototype.keydown(), attach some hacks to it
     * 
     * @param  Event e
     * @return
     */
    var select = function(e) {

        //only accept enter when event is keydown
        if (event.type === 'keydown' && !/13/.test(e.which)) return;

        var $this = $(this);

        e.preventDefault();
        e.stopPropagation();

        if ($this.is('.disabled, :disabled')) return;

        var $parent  = getParent($this);
        var isActive = $parent.hasClass('open');

        var desc = ' li:not(.divider):visible a';
        var $items = $parent.find('[data-select="true"]' + desc);

        if (!$items.length) return;

        var index = $items.index(e.target);

        /**
         * Where the hacks begin
         */
        
        var $selected = $items.eq(index);
            selectedText = $items.eq(index).text();

        //previous selected
        var $previousSelect = $this.find('.selected');

        if (!$selected.hasClass('selected')) {
            $selected.parent('li').addClass('selected');
            $parent.find('.btn').first().text(selectedText);

            $previousSelect.removeClass('selected');
        }

        //toggle it to close, and then focus
        $parent.find(toggle).dropdown('toggle').trigger('focus');

        //trigger the event
        $parent.trigger(e = $.Event('selected.bs.dropdown', {relatedTarget : this}));
    };

    $.extend(true, Dropdown.prototype, {select: select});

    $(document)
        .on('keydown.bs.dropdown.data-api', '[data-select="true"]', Dropdown.prototype.select)
        .on('click.bs.dropdown.data-api', '[data-select="true"]', Dropdown.prototype.select);

})(jQuery);