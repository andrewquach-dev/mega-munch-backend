import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateRestaurantDto } from "./dtos/create-restaurant.dto";
import { UpdateRestaurantDto } from "./dtos/update-restaurant.dto";
import { Restaurant } from "./entities/restaurant.entity";

@Injectable()
export class RestaurantService {
    constructor(@InjectRepository(Restaurant) private readonly restaruants: Repository<Restaurant>) { }

    getAll(): Promise<Restaurant[]> {
        return this.restaruants.find();
    }

    createRestaurant(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
        const newRestaurant = this.restaruants.create(createRestaurantDto);
        return this.restaruants.save(newRestaurant);
    }

    updateRestaurant({ id, data }: UpdateRestaurantDto) {
        return this.restaruants.update(id, { ...data });
    }
}