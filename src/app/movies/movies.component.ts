import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../core/services/movie.service';
import { Movie } from '../shared/models/movie';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {

  genreId:number | undefined;
  movies:Movie[] | undefined;
  constructor(private route: ActivatedRoute,private movieService:MovieService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      p=>{
        this.genreId= +p.get('id');
        //!make a call to movie service to get movie details
        this.movieService.getMovieByGenre(this.genreId).subscribe(
          (m)=>{
            this.movies=m;
            console.log(m)
          }
        )
      }
    )
  }

}
