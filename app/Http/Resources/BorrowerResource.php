<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BorrowerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'contact_number' => $this->contact_number,
            'address' => $this->address,
            'city' => $this->city,
            'province' => $this->province,
            'zip_code' => $this->zip_code,
            'country' => $this->country,
            'references' => [
                'name' => $this->references?->name ?? '',
                'contact_number' => $this->references?->contact_number ?? ''
            ],
       ];
    }
}
