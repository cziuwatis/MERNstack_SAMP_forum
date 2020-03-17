import React, {Component} from "react";


export default class Pagination extends Component
{

    constructor(props)
    {
        super(props);
    }

    toPage = (e, page) => {
        if (page >= this.props.availablePages || page < 0 || page == this.props.currentPage) {

        } else {
            this.props.goToPage(e, page);
        }
    }
    ;
            render() {

        let pages = [];
        let page_start = this.props.currentPage - 2;
        if (page_start < 0) {
            page_start = 0;
        } else if (this.props.currentPage > this.props.availablePages - 3) {
            page_start = this.props.currentPage - 3;
            if (this.props.currentPage > this.props.availablePages - 2) {
                page_start = this.props.currentPage - 4;
            }
        } else {
            page_start = this.props.currentPage - 2;
        }
        if (page_start < 0) {
            page_start = 0;
        }
        let iterate_for = page_start + 5;
        if (this.props.availablePages < iterate_for)
        {
            iterate_for = this.props.availablePages;
        }
        for (let j = page_start; j < iterate_for; j++)
        {
            if (this.props.currentPage == j)
            {
                pages.push(<span key={j} onClick={e => {
                                        this.toPage(e, j)
                                                }} className="ag_current_page">{(j + 1)}</span>);
            } else
            {
                pages.push(<span key={j} onClick={e => {
                                        this.toPage(e, j)
                                                }}>{(j + 1)}</span>);
            }
        }
        //so many parseints since for some reason for my topic component it was concatenating the numbers while for my subforum it wasn't, weird.
        return(
                <li className="ag_pagination_container">
                    <div className="ag_pagination">
                        <span onClick={e => {
                                this.toPage(e, 0)
                                                                        }}>&lt;&lt;  </span>
                        <span onClick={e => {
                                    this.toPage(e, parseInt(parseInt(this.props.currentPage)-parseInt(1)))
                                                                        }}>Previous  </span>
                        <span className="ag_pagination_pages">{pages}</span>
                        <span onClick={e => {
                                        this.toPage(e, parseInt(parseInt(this.props.currentPage) + parseInt(1)))
                                                                        }}>  Next</span>
                        <span onClick={e => {
                                            this.toPage(e, parseInt(parseInt(this.props.availablePages) - parseInt(1)))
                                                                        }}>  &gt;&gt;</span>
                    </div>
                    {
                                                this.props.enableSort ?
                                                            <select onChange={this.props.sortBy} className="ag_sort_select">
                                                                <option value="">Sort by</option>
                                                                <option value="latestPost">Latest Posts</option>
                                                                <option value="earliestPost">Earliest Posts</option>
                                                                <option value="oldestTopic">Oldest Topic</option>
                                                                <option value="newestTopic">Newest Topic</option>
                                                            </select>
                                                        : null
                    }
                </li>
                                        );
            }
        }