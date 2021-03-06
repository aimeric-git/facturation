<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\CustomerRepository;
use ApiPlatform\Core\Annotation\ApiFilter;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

/**
 * @ORM\Entity(repositoryClass=CustomerRepository::class)
 * @ApiResource(
 *      collectionOperations={
 *          "get", 
 *          "post"
 *      },
 *      itemOperations={
 *          "get",
 *          "put",
 *          "delete"
 *      },
 *      subresourceOperations={
 *          "invoices_get_subresource"={"path"="/clients/{id}/invoice"}  
 *      },
 *      normalizationContext={
 *          "groups"={"customer:read"}
 *      }
 * )
 * @ApiFilter(
 *      SearchFilter::class, 
 *      properties={"firstname":"partial",
 *                   "lastname"
 *      }
 * )
 */
class Customer
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"customer:read", "invoice:read"})
     *
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups(
     *      {"customer:read", "invoice:read"}
     * )
     * @NotBlank(message="le prénom du customer est obligatoire")
     * @Length(min=3, minMessage="Le prénom doit avoir 3 caractères au minimum",
     *          max=255, maxMessage="Le prénom ne doit pas dépasser 255 caractères")
     * 
     */
    private $firstname;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"customer:read", "invoice:read"})
     * @NotBlank(message="le nom du customer est obligatoire")
     * @Length(min=3, minMessage="Le nom doit avoir 3 caractères au minimum",
     *          max=255, maxMessage="Le nom ne doit pas dépasser 255 caractères")
     * 
     */
    private $lastname;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"customer:read", "invoice:read"})
     * @NotBlank(message="le mail est obligatoire")
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"customer:read", "invoice:read"})
     */
    private $company;

    /**
     * @ORM\OneToMany(targetEntity=Invoice::class, mappedBy="customer")
     * @Groups({"customer:read"})
     * @ApiSubresource()
     */
    private $invoices;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="customers")
     * @Groups({"customer:read"})
     */
    private $user;

    public function __construct()
    {
        $this->invoices = new ArrayCollection();
    }

    /**
     * Permet de récupérer le total des invoices
     * @Groups("customer:read")
     */
    public function getTotalAmount(): float 
    {
        return array_reduce($this->invoices->toArray(), function($total, $invoice){
            return $total + $invoice->getAmount();
        }, 0);
    }

    /**
     * Récupérer le montant total non payé
     * @Groups({"customer:read"})
     */
    public function getUnpaidAmount(): float
    {
        return array_reduce($this->invoices->toArray(), function($total, $invoice){
            return $total + ($invoice->getStatus() == "PAID" || $invoice->getStatus() == "CANCELLED" ? 0 : 
                    $invoice->getAmount());
        }, 0);
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getCompany(): ?string
    {
        return $this->company;
    }

    public function setCompany(?string $company): self
    {
        $this->company = $company;

        return $this;
    }

    /**
     * @return Collection|Invoice[]
     */
    public function getInvoices(): Collection
    {
        return $this->invoices;
    }

    public function addInvoice(Invoice $invoice): self
    {
        if (!$this->invoices->contains($invoice)) {
            $this->invoices[] = $invoice;
            $invoice->setCustomer($this);
        }

        return $this;
    }

    public function removeInvoice(Invoice $invoice): self
    {
        if ($this->invoices->removeElement($invoice)) {
            // set the owning side to null (unless already changed)
            if ($invoice->getCustomer() === $this) {
                $invoice->setCustomer(null);
            }
        }

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }
}
