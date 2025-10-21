package com.Eamcet.predictor.repository;

import com.Eamcet.predictor.model.College;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface CollegeRepository extends JpaRepository<College, Integer>, JpaSpecificationExecutor<College> {

}